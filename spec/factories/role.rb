FactoryGirl.define do
  factory :role do
    trait :admin do
      name 'Admin'
      key 'admin'
    end

    trait :super_admin do
      name 'Super Admin'
      key 'super_admin'
    end
  end
end
